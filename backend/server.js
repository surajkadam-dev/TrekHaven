import app from "./app.js";
import { config } from "dotenv";
import { transporter } from "./utils/emailService.js";

config({
  path: './config/config.env'
});

app.listen(process.env.PORT,()=>
{
  
  console.log(`server running on ${process.env.PORT}`)
})