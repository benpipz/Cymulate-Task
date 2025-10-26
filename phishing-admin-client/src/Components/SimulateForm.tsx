import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { postSimulate } from '../Services/api';

const schema = z.object({
  targetMail: z.string().email('Invalid email'),
  targetName: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function SimulateForm() {
  const { register, handleSubmit, reset, formState } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const { errors, isSubmitting } = formState;

  const onSubmit = async (data: FormData) => {
    try {
      await postSimulate(data);
      alert('Simulation started');
      reset();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to create simulation');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>Target Email *</label>
        <input {...register('targetMail')} style={styles.input} />
        {errors.targetMail && <p style={styles.error}>{errors.targetMail.message}</p>}
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Target Name</label>
        <input {...register('targetName')} style={styles.input} />
      </div>

      <button type="submit" style={styles.submitButton} disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Start Simulation'}
      </button>
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  form: { maxWidth: '500px', margin: 'auto' },
  fieldGroup: { marginBottom: '12px' },
  label: { display: 'block', marginBottom: '4px', fontWeight: 'bold' },
  input: {
    width: '100%',
    padding: '8px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderRadius: '4px',
  },
  error: { color: 'red', fontSize: '0.875rem' },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};
