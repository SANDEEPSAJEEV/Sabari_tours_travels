import { useState, useEffect, useRef } from 'react';
import { stats } from '../data/data';

function AnimatedNumber({ target, suffix = '' }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    const duration = 2000;
                    const steps = 60;
                    const increment = target / steps;
                    let current = 0;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            setCount(target);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(current));
                        }
                    }, duration / steps);
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target]);

    return (
        <div className="stat-number" ref={ref}>
            {count}{suffix}
        </div>
    );
}

export default function StatsSection() {
    return (
        <section className="stats-section">
            <div className="container">
                <div className="stats-grid">
                    {stats.map((stat, i) => (
                        <div className="stat-item" key={i}>
                            <div className="stat-icon">{stat.icon}</div>
                            <AnimatedNumber target={stat.number} suffix={stat.suffix} />
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
