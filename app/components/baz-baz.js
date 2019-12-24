import Component from '@glimmer/component';
import { action } from '@ember/object';
import connect from '../helpers/demo';

const stateToComputed = function(state) {
  return {
    number: state.fooz
  };
};

const dispatchToActions = (dispatch) => {
  return {
    up: () => dispatch({type: 'UP'})
  };
};

class MyClazz extends Component {
  constructor() {
    super(...arguments);
    this.color = 'green';
  }

  @action
  go() {
    this.actions.up();
  }
}

export default connect(stateToComputed, dispatchToActions)(MyClazz);
