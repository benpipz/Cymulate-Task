import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { createPhishingSimulation } from '../Services/api';
import { extractErrorMessage } from '../utils/error-handler';

const schema = z.object({
  targetMail: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  targetName: z
    .string()
    .max(100, 'Name must be less than 100 characters')
    .optional(),
});

type FormData = z.infer<typeof schema>;

export default function PhishingSimulationForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      targetMail: '',
      targetName: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    try {
      await createPhishingSimulation(data);
      toast.success('Phishing simulation started successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
      });
      reset();
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setSubmitError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
      <h2 style={styles.formTitle}>Create New Phishing Simulation</h2>
      <p style={styles.formDescription}>
        Enter the target email address to start a phishing simulation attempt.
      </p>

      <div style={styles.fieldGroup}>
        <label htmlFor="targetMail" style={styles.label}>
          Target Email <span style={styles.required}>*</span>
        </label>
        <input
          id="targetMail"
          type="email"
          {...register('targetMail')}
          style={{
            ...styles.input,
            ...(errors.targetMail ? styles.inputError : {}),
          }}
          placeholder="example@email.com"
          disabled={isSubmitting}
        />
        {errors.targetMail && (
          <p style={styles.error} role="alert">
            {errors.targetMail.message}
          </p>
        )}
      </div>

      <div style={styles.fieldGroup}>
        <label htmlFor="targetName" style={styles.label}>
          Target Name <span style={styles.optional}>(Optional)</span>
        </label>
        <input
          id="targetName"
          type="text"
          {...register('targetName')}
          style={{
            ...styles.input,
            ...(errors.targetName ? styles.inputError : {}),
          }}
          placeholder="John Doe"
          disabled={isSubmitting}
        />
        {errors.targetName && (
          <p style={styles.error} role="alert">
            {errors.targetName.message}
          </p>
        )}
      </div>

      {submitError && (
        <div style={styles.submitError} role="alert">
          {submitError}
        </div>
      )}

      <button
        type="submit"
        style={{
          ...styles.submitButton,
          ...(isSubmitting ? styles.submitButtonDisabled : {}),
        }}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span style={styles.spinner}>⏳</span> Starting Simulation...
          </>
        ) : (
          'Start Simulation'
        )}
      </button>
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  form: {
    maxWidth: '500px',
    margin: 'auto',
    padding: '24px',
    backgroundColor: '#fff',
    borderRadius: '8px',
  },
  formTitle: {
    margin: '0 0 8px 0',
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
  },
  formDescription: {
    margin: '0 0 24px 0',
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.5',
  },
  fieldGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    fontSize: '14px',
    color: '#333',
  },
  required: {
    color: '#d32f2f',
  },
  optional: {
    color: '#999',
    fontSize: '12px',
    fontWeight: 'normal',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#ddd',
    borderRadius: '6px',
    fontSize: '14px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box' as const,
  },
  inputError: {
    borderColor: '#d32f2f',
    boxShadow: '0 0 0 2px rgba(211, 47, 47, 0.1)',
  },
  error: {
    color: '#d32f2f',
    fontSize: '12px',
    marginTop: '4px',
    display: 'block',
  },
  submitError: {
    padding: '12px',
    backgroundColor: '#ffebee',
    color: '#d32f2f',
    borderRadius: '6px',
    fontSize: '14px',
    marginBottom: '16px',
    border: '1px solid #ffcdd2',
  },
  submitButton: {
    width: '100%',
    padding: '12px 24px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'background-color 0.2s, transform 0.1s',
  },
  submitButtonDisabled: {
    backgroundColor: '#90caf9',
    cursor: 'not-allowed',
    opacity: 0.7,
  },
  spinner: {
    display: 'inline-block',
    marginRight: '8px',
  },
};
