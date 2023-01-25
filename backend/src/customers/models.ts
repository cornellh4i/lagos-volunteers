import { getModelForClass, prop } from "@typegoose/typegoose";

class Job {
  constructor(title: string, company: string) {
    this.title = title;
    this.company = company;
  }

  @prop()
  public title!: string;

  @prop()
  public company!: string;
}

class Customer {
  constructor(name: string, age: number, title: string, company: string) {
    this.name = name;
    this.age = age;
    this.job = new Job(title, company);
  }

  @prop()
  public name!: string;

  @prop()
  public age!: number;

  // nesting a sub-document
  @prop()
  public job!: Job;
}
const CustomerModel = getModelForClass(Customer);
export { Customer, CustomerModel };
