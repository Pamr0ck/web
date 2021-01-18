export class Stock {
  constructor(
    public id: number,
    public startingPrice: number,
    public type: string, // Uniform, Normal, Binomial
    public maxChangeValue: number,
    public quantity: number) {
  }
}
