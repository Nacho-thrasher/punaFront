export class Empresa {

  constructor(
    public uid: string,
    public name: string,
    public description: string,
    public city: string,
    public direction: string,
    public phone: string | null,
    public cuit: string | null,
    public contratista: Empresa
  ){ }

}
