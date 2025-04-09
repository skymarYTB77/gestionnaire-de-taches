function Date(props) {
  let display = '';

  if (!props?.dateStart) {
    return null;
  }

  const dateValue = props.dateStart;
  const date = (typeof dateValue === 'string' || typeof dateValue === 'number') ? new Date(dateValue) : dateValue;

  if (!isNaN(date)) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    display = `${day}/${month}/${year}`;
  }

  return display ? (
    <div className="text-neutral-300 text-xs">
      {display}
    </div>
  ) : null;
}

export default Date;