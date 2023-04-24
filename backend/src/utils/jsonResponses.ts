export const successJson = (data: any) => {
  return {
    success: true,
    data,
  };
};

export const errorJson = (error: Error) => {
  return {
    success: false,
    error: error,
  };
};
