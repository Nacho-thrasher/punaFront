// export class BaseModel {
//   constructor() {}
//   //? copyValues sirve para copiar los valores de un objeto a otro objeto sin importar el tipo de objeto ni el nombre de las propiedades ni el tipo de la propiedad a copiar
//   public static copyValues<T>(from: any, to: T | any) {
//     if (from == null || from == undefined) {
//       return to;
//     }
//     for (const key in from) {
//       if (
//         Object.prototype.hasOwnProperty.call(from, key) &&
//         Object.prototype.hasOwnProperty.call(to, key)
//       ) {
//         const value = from[key];
//         to[key] = value;
//       }
//     }
//     return to;
//   }

// }
