import { Document, LeanDocument, Types } from 'mongoose';

export type MongoGeoLocation = {
  coordinates: number[];
  type: 'Point';
};

// export type MongoDocument<T> = LeanDocument<
//   Partial<T> & Document<Types.ObjectId, any, any>
// >;

export type MongoLeanDocument<T> = LeanDocument<
  Partial<T> &
    Document<Types.ObjectId, any, any> &
    Required<{
      _id: Types.ObjectId;
    }>
>;
