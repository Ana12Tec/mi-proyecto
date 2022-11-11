const usarname : string | number = 'anatec';

const sum = (a: number, b : number) => {
  return a + b;
}

sum(1,2);

class Persona{
  constructor(public age:number, public lastname:string){
  }
}

const ana = new Persona(36,'Tec');
