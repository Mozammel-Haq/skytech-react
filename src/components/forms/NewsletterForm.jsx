import { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '../ui/Button.jsx'

function NewsletterForm({ darkMode = true }) {
  const [email, setEmail] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!email.trim()) {
      toast.error('Please enter your email')
      return
    }

    const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
    if (!emailPattern.test(email.trim())) {
      toast.error('Enter a valid email address')
      return
    }

    toast.success('Subscribed! We will keep you posted.', {
      action: {
        label: 'View offers',
        onClick: () => window.open('/shop?sort=deals', '_self'),
      },
    })
    setEmail('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        className={`h-12 flex-1 rounded-full px-5 text-sm placeholder:text-white/70 focus:outline-none ${
          darkMode
            ? 'border border-white/20 bg-white/10 text-white focus:border-white'
            : 'border border-neutral-300 bg-white text-neutral-900 focus:border-primary'
        }`}
      />
      <Button
        type="submit"
        size="lg"
        className={`rounded-full ${
          darkMode
            ? 'bg-secondary text-neutral-900 hover:bg-secondary/90'
            : 'bg-primary text-white hover:bg-primary/90'
        }`}
      >
        Join the list
      </Button>
    </form>
  )
}

export default NewsletterForm
