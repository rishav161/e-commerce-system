import Link from "next/link";
import "../styles/links.css";

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fafafa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        maxWidth: '800px',
        padding: '3rem',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: '#000',
        }}>
          Welcome to E-Commerce Store
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: '#666',
          marginBottom: '3rem',
          lineHeight: '1.6',
        }}>
          Browse our products, add them to your cart, and checkout seamlessly.
          Your orders will be synchronized across our microservices architecture.
        </p>
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
        }}>
          <Link
            href="/products"
            className="primary-link"
          >
            Browse Products
          </Link>
          <Link
            href="/orders"
            className="secondary-link"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

