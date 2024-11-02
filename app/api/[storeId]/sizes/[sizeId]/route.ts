import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(_req: Request, { params }: { params: { sizeId: string } }) {
     try {
          if (!params.sizeId) {
               return new NextResponse("Bad Request : Size Id is required", { status: 400 });
          }

          const size = await prismadb.size.findUnique({
               where: {
                    id: params.sizeId,
               },
          });

          return NextResponse.json(size);
     } catch (error) {
          console.log("[SIZE_GET]", error);
          return new NextResponse("Internal error", { status: 500 });
     }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string; sizeId: string } }) {
     try {
          const { userId } = auth();
          if (!userId) {
               return new NextResponse("Unauthenticated", { status: 401 });
          }

          const body = await req.json();
          const { name, value } = body;

          if (!name) {
               return new NextResponse("Bad Request : name is required", { status: 400 });
          }
          if (!value) {
               return new NextResponse("Bad Request : value is required", { status: 400 });
          }

          if (!params.sizeId) {
               return new NextResponse("Bad Request : Size Id is required", { status: 400 });
          }

          const storeByUserid = await prismadb.store.findFirst({
               where: {
                    id: params.storeId,
                    userId,
               },
          });
          if (!storeByUserid) {
               return new NextResponse("Unauthorized", { status: 403 });
          }

          const size = await prismadb.size.updateMany({
               where: {
                    id: params.sizeId,
               },
               data: { name, value },
          });

          return NextResponse.json(size);
     } catch (error) {
          console.log("[SIZE_PATCH]", error);
          return new NextResponse("Internal error", { status: 500 });
     }
}

export async function DELETE(_req: Request, { params }: { params: { storeId: string; sizeId: string } }) {
     try {
          const { userId } = auth();
          if (!userId) {
               return new NextResponse("Unauthenticated", { status: 401 });
          }

          if (!params.sizeId) {
               return new NextResponse("Bad Request : Size Id is required", { status: 400 });
          }

          const storeByUserid = await prismadb.store.findFirst({
               where: {
                    id: params.storeId,
                    userId,
               },
          });
          if (!storeByUserid) {
               return new NextResponse("Unauthorized", { status: 403 });
          }

          const size = await prismadb.size.deleteMany({
               where: {
                    id: params.sizeId,
               },
          });

          return NextResponse.json(size);
     } catch (error) {
          console.log("[SIZE_DELETE]", error);
          return new NextResponse("Internal error", { status: 500 });
     }
}
