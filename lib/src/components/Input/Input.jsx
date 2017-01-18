import React, { PropTypes } from 'react';
import cx from 'classnames';
import rules from './../../rules';
import Base from './../Base/Base';

export default class Input extends Base {
    static propTypes = {
        validations: PropTypes.arrayOf(PropTypes.string).isRequired,
        errorClassName: PropTypes.string,
        containerClassName: PropTypes.string,
        errorContainerClassName: PropTypes.string
    };

    constructor(props, context) {
        super(props, context);

        const isCheckbox = !!(props.type === 'checkbox' || props.type === 'radio');
        const checkboxValue = props.checked ? props.value : '';

        // TODO: Refactor conditions
        this.state = {
            value: isCheckbox ? checkboxValue : props.value,
            isChanged: isCheckbox ? props.checked : !!props.value,
            isFocued: false,
            isCheckbox,
            isUsed: isCheckbox,
            isChecked: isCheckbox ? !!props.checked : true
        };

        context.register(this);
    }

    render() {
        const {
            /* eslint-disable */
            validations,
            /* eslint-enable */
            errorClassName,
            containerClassName,
            errorContainerClassName,
            className,
            validateOnChange,
            ...rest } = this.props;
        // TODO: Refactor conditions
        const isInvalid = this.state.isUsed
            && this.state.isChanged
            && !this.state.isFocused
            && !!this.context.errors[this.props.name];
        const value = this.state.isCheckbox ? this.props.value : this.state.value;
        const error = isInvalid && this.context.errors[this.props.name][0];
        let hint = null;

        if (isInvalid) {
            hint = typeof error === 'function' ? error(value, this.context.components) : rules[error].hint(value, this.context.components);
        }

        return (
            <div
              className={cx({
                  [containerClassName]: !!containerClassName,
                  [errorContainerClassName]: !!error && errorContainerClassName
              })}
            >
                <input
                  {...rest}
                  className={cx({
                      [className]: !!className,
                      [errorClassName]: !!error && errorClassName
                  })}
                  checked={this.state.isChecked}
                  onChange={this.onChange}
                  onFocus={this.onFocus}
                  onBlur={this.onBlur} value={this.state.value}
                />
                {hint}
            </div>
        );
    }
}
