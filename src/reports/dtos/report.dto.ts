import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  id: number;
  @Expose()
  price: number;
  @Expose()
  approved: boolean;
  @Expose()
  make: string;
  @Expose()
  model: string;
  @Expose()
  year: number;
  @Expose()
  lat: number;
  @Expose()
  lng: number;
  @Expose()
  mileage: number;

  // we destructure obj attribute from transform decorator's callback fn to get user id from the user attribute saved in this object
  @Transform(({ obj: reportEntityObject }) => reportEntityObject.user.id)
  @Expose()
  userId: number;
}
