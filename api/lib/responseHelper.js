const sendResponse = (res, statusCode, message, data = null) => {
    const response = { message };
    if (data) {
      response.data = data;
    }
    res.status(statusCode).json(response);
  };
  
  export default sendResponse;