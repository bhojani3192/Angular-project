export const SecretKey = 'Natrix';

export class Routes{
    public static Landingpage = "/"
    public static qrcodelogib = "/qrcode-login"
}

export class EarlyAccess {
  public static sendEarlyAccessRequest = 'EarlyAccess/sendEarlyAccessRequest';
}

export class TopCategoryContent {
  public static getDefaultTopCategoryContents =
    'TopCategoryContent/getDefaultTopCategoryContents';
}

export class UserContent {
  public static UserContent = 'UserContent';
  public static downloadContentWithWaterMark =
    'UserContent/downloadContentWithWaterMark/';
}

export class authentication {
  public static userlogin: string = 'User/login';
  public static userSignUp: string = 'User/register';
  public static sendOTP = 'User/sendOTP/';
  public static verifyOTP:string = "User/verifyOTP"
  public static resetPassword:string = "User/resetPassword"
}

export class User {
  public static generateQRLoginCode = 'User/generateQRLoginCode';
  public static loginWithCode = 'User/loginWithCode/';
  public static User = 'User';
}
