function dateFormatter(isoDateString) {
    const date = new Date(isoDateString);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
  }

  export default dateFormatter;