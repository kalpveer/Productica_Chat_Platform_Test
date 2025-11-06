import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Founder, TechFlow",
    content: "Productica helped me validate my SaaS idea in just 30 minutes. The AI insights saved me months of guesswork.",
    rating: 5,
    avatar: "SC"
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "CEO, GreenTech Solutions",
    content: "The market research module is incredibly detailed. It identified opportunities I hadn't even considered.",
    rating: 5,
    avatar: "MR"
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "Product Manager, InnovateLab",
    content: "PMF analysis gave me concrete metrics to track. Our product launch was much more successful because of it.",
    rating: 5,
    avatar: "EW"
  },
  {
    id: 4,
    name: "David Kim",
    role: "Startup Founder",
    content: "As a first-time entrepreneur, Productica was like having a seasoned advisor. Highly recommend!",
    rating: 5,
    avatar: "DK"
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "Innovation Director",
    content: "We use Productica for all our new product ideas. The all-in-one analysis is comprehensive and actionable.",
    rating: 5,
    avatar: "LT"
  }
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">What Our Users Say</h2>
        <p className="text-muted-foreground">Join thousands of entrepreneurs who trust Productica</p>
      </div>

      <div className="relative">
        <Card className="bg-card border-border">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <Quote className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              
              <div className="space-y-4 flex-1">
                <p className="text-lg text-foreground leading-relaxed">
                  "{testimonials[currentIndex].content}"
                </p>
                
                <div className="flex items-center gap-2">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {testimonials[currentIndex].avatar}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {testimonials[currentIndex].name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevious}
            className="w-10 h-10 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {/* Dots indicator */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            className="w-10 h-10 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}