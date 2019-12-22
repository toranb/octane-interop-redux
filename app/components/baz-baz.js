import Component from '@ember/component';
import { action, get, computed } from '@ember/object';
import { connect } from 'ember-redux';

const stateToComputed = function(state, attrs) {
  return {
    number: state.fooz,
    greeting: `Hello ${attrs.name}!`
  };
};

const dispatchToActions = (dispatch) => {
  return {
    up: () => dispatch({type: 'UP'})
  };
};

class MyClazz extends Component {
  init() {
    super.init(...arguments);
    this.color = 'green';
  }

  @computed('greeting')
  get bar() {
    const someKey = get(this, 'greeting');
    return `${someKey} - computed`;
  }

  @action
  go() {
    this.actions.up();
  }
}

export default connect(stateToComputed, dispatchToActions)(MyClazz);
