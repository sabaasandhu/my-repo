import React from 'react';
import { MDBFooter, MDBContainer } from 'mdb-react-ui-kit';
import { FaInstagram, FaFacebookF, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  return (
    <MDBFooter className='text-center text-white mt-8 bg-gradient-to-tl from-teal-500 via-teal-700 to-orange-500 shadow-lg ' style={{ backgroundColor: '#0a4275' }}>
      
      {/* Register section */}
      <MDBContainer className='p-4 pb-0'>
        <section>
          <p className='d-flex justify-content-center align-items-center'>
            <span className='me-3'>Register for free</span>
            <button style={{
              borderRadius: '20px',
              border: '1px solid white',
              background: 'transparent',
              color: 'white',
              padding: '8px 20px'
              
            }}>
              <a href="/signup" style={{ color: 'inherit', textDecoration: 'none' }}>Sign Up</a>
            </button>
          </p>
        </section>
      </MDBContainer>

      {/* Social Icons */}
      <MDBContainer className='pb-4'>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '14px' }}>
          
          <a href="https://www.instagram.com/" target="_blank" style={{
            color: 'white',
            fontSize: '28px',
            backgroundColor: '#E4405F',
            borderRadius: '50%',
            width: '45px',
            height: '45px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textDecoration: 'none'
          }}>
            <FaInstagram />
          </a>

          <a href="https://www.facebook.com/" target="_blank" style={{
            color: 'white',
            fontSize: '28px',
            backgroundColor: '#1877F2',
            borderRadius: '50%',
            width: '45px',
            height: '45px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textDecoration: 'none'
          }}>
            <FaFacebookF />
          </a>

          <a href="https://www.tiktok.com/" target="_blank" style={{
            color: 'white',
            fontSize: '28px',
            backgroundColor: '#000000',
            borderRadius: '50%',
            width: '45px',
            height: '45px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textDecoration: 'none'
          }}>
            <FaTiktok />
          </a>

        </div>
      </MDBContainer>

      {/* Copyright */}
      <div className='text-center p-3' style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
        © {new Date().getFullYear()} YourWebsite — Coming Soon 🚀
      </div>

    </MDBFooter>
  );
};

export default Footer;
