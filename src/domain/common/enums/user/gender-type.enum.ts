export enum GenderTypeEnum {
  male,
  female,
  unspecified,
}

export const genderTypeEnumMap = (key: string) => {
  return GenderTypeEnum[key as keyof typeof GenderTypeEnum];
};
