import { Empresa } from "../empresas/empresa.model";
import { UserType } from "./user_type.model";

export class Usuario {

  constructor(
    public uid: string,
    public userName: string,
    public firstName: string,
    public lastName: string,
    public typeDocument: string,
    public document: number,
    public cuil: number,
    public image: string,
    // public phone: null,
    // public address: null,
    // public city: null,
    // public state: null,
    // public country: null,
    // public postalCode: null,
    public empresa: Empresa | null,
    public user_type: UserType | null,
    public user: Usuario | null,
  )
  { }
}
// uid: string | null;
// userName: string | null;
// firstName: string | null;
// lastName: string | null;
// email: string | null;
// typeDocument: string | null;
// document: string | null;
// cuil: string | null;
// image: string | null;
// phone: string | null;
// address: string | null;
// city: string | null;
// state: string | null;
// country: string | null;
// postalCode: string | null;
// status: string | null;
// userType: UserType | null;
