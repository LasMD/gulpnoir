import { Dispatcher } from 'flux';

class GulpPluginsDispatcher extends Dispatcher {}
const GPD = new GulpPluginsDispatcher();

export default GPD;
export const GulpPluginsDispatch = GPD.dispatch.bind(GPD);
