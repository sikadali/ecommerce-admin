import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(_req: Request, { params }: { params: { colorId: string } }) {
     try {
          if (!params.colorId) {
               return new NextResponse("Bad Request : Color Id is required", { status: 400 });
          }

          const color = await prismadb.color.findUnique({
               where: {
                    id: params.colorId,
               },
          });

          return NextResponse.json(color);
     } catch (error) {
          console.log("[COLOR_GET]", error);
          return new NextResponse("Internal error", { status: 500 });
     }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string; colorId: string } }) {
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

          if (!params.colorId) {
               return new NextResponse("Bad Request : Color Id is required", { status: 400 });
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

          const color = await prismadb.color.updateMany({
               where: {
                    id: params.colorId,
               },
               data: { name, value },
          });

          return NextResponse.json(color);
     } catch (error) {
          console.log("[COLOR_PATCH]", error);
          return new NextResponse("Internal error", { status: 500 });
     }
}

export async function DELETE(_req: Request, { params }: { params: { storeId: string; colorId: string } }) {
     try {
          const { userId } = auth();
          if (!userId) {
               return new NextResponse("Unauthenticated", { status: 401 });
          }

          if (!params.colorId) {
               return new NextResponse("Bad Request : Color Id is required", { status: 400 });
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

          const color = await prismadb.color.deleteMany({
               where: {
                    id: params.colorId,
               },
          });

          return NextResponse.json(color);
     } catch (error) {
          console.log("[COLOR_DELETE]", error);
          return new NextResponse("Internal error", { status: 500 });
     }
}
