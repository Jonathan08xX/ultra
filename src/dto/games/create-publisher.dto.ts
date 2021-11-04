export default class CreatePublisherDto {

  name: string;

  siret: number;

  phone: string;

  constructor(name: string, siret: number, phone: string) {
    this.name = name;
    this.siret = siret;
    this.phone = phone;
  }
}
