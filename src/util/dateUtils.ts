const dateUtil = {
  isDateEquals: (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  },
  isDateBefore: (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() <= date2.getFullYear() &&
      date1.getMonth() <= date2.getMonth() &&
      date1.getDate() <= date2.getDate()
    );
  },
  isDateAfter: (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() >= date2.getFullYear() &&
      date1.getMonth() >= date2.getMonth() &&
      date1.getDate() >= date2.getDate()
    );
  }
};

export default dateUtil;
