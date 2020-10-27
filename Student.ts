export class Student{
    nombre: string;
    codigo: number;
    cedula: number;
    edad: number;
    direccion: string;
    telefono: number;
    constructor(name:string,codigo:number,cedula:number,edad:number,dir:string,tel:number){
        this.nombre =name;
        this.codigo = codigo;
        this.cedula =  cedula;
        this.edad = edad;
        this.direccion =  dir;
        this.telefono = tel;
    }
}