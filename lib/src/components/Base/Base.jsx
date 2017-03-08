import { Component, PropTypes } from 'react';
import noop from './../../utils/noop';

class Base extends Component {
    static propTypes = {
        value: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        validateOnChange: PropTypes.bool,
        onFocus: PropTypes.func,
        onChange: PropTypes.func,
        onBlur: PropTypes.func
    };

    static contextTypes = {
        register: PropTypes.func.isRequired,
        unregister: PropTypes.func.isRequired,
        validateState: PropTypes.func.isRequired,
        errorsForComponent: PropTypes.func.isRequired,
        hideError: PropTypes.func.isRequired,
        components: PropTypes.objectOf(PropTypes.any),
        errors: PropTypes.objectOf(PropTypes.array)
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({
                value: nextProps.value,
                isChanged: true
            }, () => {
                this.context.validateState(this.props.name);
            });
        }
    }

    componentWillUnmount() {
        this.context.unregister(this);
    }

    onChange = (event) => {
        // TODO: Refactor conditions
        const isChecked = this.state.isCheckbox ? !this.state.isChecked : true;
        const checkboxValue = isChecked ? event.target.value : '';
        const value = this.state.isCheckbox ? checkboxValue : event.target.value;

        event.persist();

        this.setState({
            value,
            isChecked
        }, () => {
            (this.props.validateOnChange && this.context.validateState(this.props.name));

            (this.props.onChange || noop)(event);
        });
    };

    onBlur = (event) => {
        event.persist();

        this.setState({
            isUsed: true,
            isFocused: false
        }, () => {
            this.context.validateState(this.props.name);

            (this.props.onBlur || noop)(event);
        });
    };

    onFocus = (event) => {
        event.persist();

        this.setState({
            isFocused: true,
            isChanged: true
        }, () => {
            this.context.hideError(event.target.name);
            (this.props.onFocus || noop)(event);
        });
    }
}

Base.defaultProps = {
  validateOnChange: false
}

export default Base;
