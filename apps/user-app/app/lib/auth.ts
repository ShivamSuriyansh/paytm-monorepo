import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials"
// import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcrypt";

export const authOptions = {
    providers: [
      CredentialsProvider({
          name: 'Credentials',
          credentials: {
            phone: { label: "Phone number", type: "text", placeholder: "1231231231", required: true },
            password: { label: "Password", type: "password", required: true }
          },
          // TODO: User credentials type from next-aut
          async authorize(credentials: any) {
            // Do zod validation, OTP validation here
            const hashedPassword = await bcrypt.hash(credentials.password, 10);
            const existingUser = await db.user.findFirst({
                where: {
                    number: credentials.phone
                }
            });

            if (existingUser) {
                const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
                if (passwordValidation) {
                    return {
                        id: existingUser.id.toString(),
                        name: existingUser.name,
                        email: existingUser.number
                    }
                }
                return null;
            }

            try {
                const user = await db.user.create({
                    data: {
                        number: credentials.phone,
                        password: hashedPassword
                    }
                });
            
                return {
                    id: user.id.toString(),
                    name: user.name,
                    email: user.number
                }
            } catch(e) {
                console.error(e);
            }

            return null
          },
        })
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_CLIENT_ID || "",
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        //   })
    ],
    secret: process.env.JWT_SECRET || "secret",
    callbacks: {
        // TODO: can u fix the type here? Using any is bad
        async session({ token, session }: any) {
            session.user.id = token.sub
            return session
        }
    // Since we need number for transfer , for now i wont be using this login method

        // async signIn(profile :any){
        //     console.log("##############Profile: ",profile)
        //     const existingUser = await db.user.findUnique({
        //         where : {
        //             email: profile.user.email
        //         }
        //     })
        //     console.log('########### Existing User: ',existingUser);

        //     if(existingUser){
        //         return {
        //             id: existingUser.id,
        //             email : existingUser.email,
        //             name : existingUser.name
        //         }
        //     } 
        //     const phone =  (Math.floor(Math.random() * 9000000000) + 1000000000).toString();
        //     try {
        //         const user  = await db.user.create({
        //             data : {
        //                 number : phone,
        //                 email : profile.user.email,
        //                 password : '',
        //                 name : profile.user.name
        //             }
        //         })
        //         console.log("user: ",user);
        //         return {
        //             id : user.id.toString(),
        //             name : user.name,
        //             email :user.email
        //         }
        //     }catch(e){
        //         console.error("Error: ",e);
        //         return {
        //             message : "Couldn't register"
        //         }
        //     }
        // } 
    }
  }
  