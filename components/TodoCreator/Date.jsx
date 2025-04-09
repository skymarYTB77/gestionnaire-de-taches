function DateInput(props) {
  return (
    <div className="w-1/2">
      <div className="font-semibold mb-1">Date</div>
      <div className="w-max flex flex-col gap-1">
        <input 
          ref={props.dateStartRef}
          className="bg-transparent hover:bg-neutral-900 focus:bg-neutral-900 [color-scheme:dark]
          rounded-md text-sm placeholder-neutral-400 border-0 transition-all p-2 outline-none"
          type="date"
          value={props.todo.dateStart}
          onChange={() => {
            props.setTodo({...props.todo, dateStart: props.dateStartRef.current.value});
          }}
        />
      </div>
    </div>
  )
}

export default DateInput;