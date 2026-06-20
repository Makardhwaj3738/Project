async function seed() {
  try {
    const res1 = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Alice Traveler', email: 'alice@example.com', password: 'password123' })
    });
    console.log('Alice created:', await res1.text());
  } catch(e) { console.log('Error creating Alice'); }
  
  try {
    const res2 = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Bob Explorer', email: 'bob@example.com', password: 'password123' })
    });
    console.log('Bob created:', await res2.text());
  } catch(e) { console.log('Error creating Bob'); }
}
seed();
