import React, { forwardRef } from 'react'
import clsx from 'clsx'

const Input = forwardRef(
  (
    {
      label,
      error,
      icon: Icon,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="label">
            {label}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 z-10">
              <Icon className="w-4 h-4" />
            </span>
          )}

          <input
            ref={ref}
            className={clsx(
              error ? 'input-error' : 'input',
              Icon && 'pl-10',
              className
            )}
            {...props}
          />
        </div>

        {error && (
          <p className="error-msg">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input

export const Select = forwardRef(
  (
    {
      label,
      error,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="label">
            {label}
          </label>
        )}

        <select
          ref={ref}
          className={clsx(
            error ? 'input-error' : 'input',
            className
          )}
          {...props}
        >
          {children}
        </select>

        {error && (
          <p className="error-msg">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export const Textarea = forwardRef(
  (
    {
      label,
      error,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="label">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          rows={4}
          className={clsx(
            error ? 'input-error' : 'input',
            'resize-none',
            className
          )}
          {...props}
        />

        {error && (
          <p className="error-msg">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
