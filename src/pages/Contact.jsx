import { Mail, Phone, MapPin } from 'lucide-react'
import Button from '@/components/common/Button'
import Input, { Textarea } from '@/components/common/Input'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export default function Contact() {
  const { register, handleSubmit, reset } = useForm()
  const onSubmit = (d) => { toast.success('Message sent! We\'ll get back to you soon.'); reset() }

  return (
    <div className="py-16">
      <div className="page-container max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="section-title mb-3">Contact Us</h1>
          <p className="text-stone-500">Have a question? We'd love to hear from you.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            {[{ icon: Mail, label: 'Email', val: 'support@nestfinder.in' },{ icon: Phone, label: 'Phone', val: '+91 98765 43210' },{ icon: MapPin, label: 'Address', val: 'Mumbai, Maharashtra, India' }].map(({ icon:Icon, label, val }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center shrink-0"><Icon className="w-5 h-5 text-primary-500" /></div>
                <div><p className="text-xs text-stone-400 font-medium uppercase tracking-wide">{label}</p><p className="text-stone-800 mt-0.5">{val}</p></div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-4">
            <Input label="Name" {...register('name')} />
            <Input label="Email" type="email" {...register('email')} />
            <Input label="Subject" {...register('subject')} />
            <Textarea label="Message" {...register('message')} />
            <Button type="submit" className="w-full">Send Message</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
