import { Dispatcher } from 'flux';

class GraphsDispatcher extends Dispatcher {}
const GD = new GraphsDispatcher();

export default GD;
export const GraphsDispatch = GD.dispatch.bind(GD);
