export const successJson = (data: any) => {
  return {
    success: true,
    data,
  };
};

export const errorJson = (error: any) => {
  return {
    success: false,
    error: error,
  };
};
