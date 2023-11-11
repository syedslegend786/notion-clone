export const handleApiError = (data: any) => {
  let toReturn = "";
  if (data?.response?.data) {
    toReturn = data.response?.data;
  } else {
    toReturn = data.message;
  }
  return toReturn;
};
