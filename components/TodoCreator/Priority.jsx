import Checkbox from '../Checkbox';

function Priority(props) {
  return (
    <div>
      <div className="font-semibold mb-3">Priorité</div>
      <div className="flex items-center gap-2">
        <Checkbox
          todo={props.todo}
          setTodo={props.setTodo}
          priority="high"
          key={'high-' + props.todo.priority}
          checked={props.todo.priority==='high'}
          handleClick={() => { props.setTodo({...props.todo, priority: 'high'}); }}
        />
        <label className="mr-3">Haute</label>
        <Checkbox
          todo={props.todo}
          setTodo={props.setTodo}
          priority="mid"
          key={'mid-'+props.todo.priority}
          checked={props.todo.priority==='mid'}
          handleClick={() => { props.setTodo({...props.todo, priority: 'mid'}); }}
        />
        <label className="mr-3">Moyenne</label>
        <Checkbox
          todo={props.todo}
          setTodo={props.setTodo}
          priority="low"
          key={'low-'+props.todo.priority}
          checked={props.todo.priority==='low'}
          handleClick={() => { props.setTodo({...props.todo, priority: 'low'}); }}
        />
        <label className="mr-3">Basse</label>
      </div>
    </div>
  )
}

export default Priority;