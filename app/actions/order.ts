"use server"
import db from "@/db/db"

export async function userOrderExist(email:string,productId:string){
    return(
    (await db.order.findFirst({
        where:{user:{email:email},productId:productId},
        select:{id:true},
    }))!=null
    )

}