const asyncHandler = (fn, setLoading=()=>{}, setError=()=>{}) => {
    return async () => {
      try {
        setLoading(true); // Start loading
        await fn(); // Execute the passed function
      } catch (err) {
        setError(err); // Handle any error
      } finally {
        setLoading(false); // Stop loading
      }
    };
  };
  
  export default asyncHandler;
  