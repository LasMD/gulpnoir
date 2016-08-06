import { Dispatcher } from 'flux';

class TasksDispatcher extends Dispatcher {}
const TD = new TasksDispatcher();

export default TD;
export const TasksDispatch = TD.dispatch.bind(TD);
