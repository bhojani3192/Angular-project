import { environment } from "../../environments/environment.development";

export class Global {
    // public static WebUrl: string = "https://api-devappserver.azurewebsites.net/v1/";
    
    // public static WebUrl: string = "http://192.168.1.138/v1/"; // local

    public static WebUrl: string = environment.apiUrl
   
    
}