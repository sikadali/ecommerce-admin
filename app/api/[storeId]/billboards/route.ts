import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
     try {
          const { userId } = auth();
          const body = await req.json();

          const { label, imageUrl } = body;

          // check clerk authentication
          if (!userId) {
               return new NextResponse("Unauthenticated", { status: 401 });
          }

          if (!label) {
               return new NextResponse("Bad Request : label is required", { status: 400 });
          }

          if (!imageUrl) {
               return new NextResponse("Bad Request : imageUrl is required", { status: 400 });
          }

          if (!params.storeId) {
               return new NextResponse("Bad Request : Store Id is required", { status: 400 });
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

          const billboard = await prismadb.billboard.create({
               data: { label, imageUrl, storeId: params.storeId },
          });

          return NextResponse.json(billboard);
     } catch (error) {
          console.log("[BILLBOARDS_POST]", error);
          return new NextResponse("Internal error", { status: 500 });
     }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
     try {
          if (!params.storeId) {
               return new NextResponse("Bad Request : Store Id is required", { status: 400 });
          }

          const billboards = await prismadb.billboard.findMany({
               where: { storeId: params.storeId },
          });

          return NextResponse.json(billboards);
     } catch (error) {
          console.log("[BILLBOARDS_GET]", error);
          return new NextResponse("Internal error", { status: 500 });
     }
}
