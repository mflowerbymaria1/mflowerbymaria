import { execSync } from 'child_process';

const device_code = '05a84d2dccd2f641e767df8c73f4b73936b0d505';
const client_id = '178c6fc778ccc68e1d6a';

async function poll() {
  while (true) {
    try {
      const res = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: `client_id=${client_id}&device_code=${device_code}&grant_type=urn:ietf:params:oauth:grant-type:device_code`
      });
      const data = await res.json();
      
      if (data.access_token) {
        console.log('Got token!');
        const token = data.access_token;
        
        // Update remote URL with token
        const repo = 'github.com/mflowerbymaria1/mflowerbymaria.git';
        try {
          execSync(`git remote set-url origin https://x-access-token:${token}@${repo}`);
          execSync('git push -u origin main');
          console.log('Push successful');
        } catch (e) {
          console.error('Push failed', e.stdout?.toString(), e.stderr?.toString());
        } finally {
          // Remove token from remote for security
          execSync(`git remote set-url origin https://${repo}`);
        }
        break;
      } else if (data.error === 'authorization_pending') {
        // wait 6 seconds (GitHub API requires exact intervals)
        await new Promise(resolve => setTimeout(resolve, 6000));
      } else if (data.error === 'slow_down') {
        await new Promise(resolve => setTimeout(resolve, (Number(data.interval) + 1) * 1000));
      } else {
        console.error('Error', data);
        break;
      }
    } catch(e) {
      console.error(e);
      await new Promise(resolve => setTimeout(resolve, 6000));
    }
  }
}

poll();
