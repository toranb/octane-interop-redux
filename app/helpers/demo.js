import Component from '@glimmer/component';
import { notifyPropertyChange, get, defineProperty } from '@ember/object';
import { inject } from '@ember/service';
import { bindActionCreators } from 'redux';

function changedKeys(props, newProps) {
  return Object.keys(props).filter(key => {
    return props[key] !== newProps[key];
  });
}

export default (stateToComputed, dispatchToActions= () => ({})) => {

  return IncomingComponent => {

    const WrappedComponent = IncomingComponent || Component;

    defineProperty(WrappedComponent.prototype, 'redux', inject('redux'));

    return class Connect extends WrappedComponent {

      constructor() {
        super(...arguments);

        const redux = get(this, 'redux');

        if (stateToComputed) {
          let props = stateToComputed.call(this, redux.getState());
          Object.keys(props).forEach(name => {
            let descriptor = {
              enumerable: true,
              configurable: false,
              set() {},
              get() {
                return stateToComputed.call(this, redux.getState())[name];
              }
            };
            Object.defineProperty(this, name, descriptor);
          });

          this._handleChange = () => {
            let newProps = stateToComputed.call(this, redux.getState());

            if (props === newProps) return;

            let notifyProperties = changedKeys(props, newProps);

            props = newProps;

            notifyProperties.forEach(name => {
              this[name] = newProps[name];
            });

            notifyProperties.forEach(name => notifyPropertyChange(this, name));
          }

          this.unsubscribe = redux.subscribe(() => {
            this._handleChange();
          });
        }

        if (typeof dispatchToActions === 'function') {
          this.actions = Object.assign(this.actions,
            this.actions, dispatchToActions.call(this, redux.dispatch.bind(redux))
          );
        }

        if (typeof dispatchToActions === 'object') {
          this.actions = Object.assign({},
            this.actions, bindActionCreators(dispatchToActions, redux.dispatch.bind(redux))
          );
        }
      }

      willDestroy() {
        if (this.unsubscribe) {
          this.unsubscribe();
          this.unsubscribe = null;
        }
      }

    }

  }
}
