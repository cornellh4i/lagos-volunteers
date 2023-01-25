export const successJson = (data: any) => {
  return {
    success: true,
    data: data,
  };
};

export const errorJson = (error: any) => {
  return {
    success: false,
    error: error,
  };
};
