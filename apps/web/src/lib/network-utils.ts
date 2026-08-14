export function ipToLong(ip: string): number {
  return ip.split(".").reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

export function longToIp(long: number): string {
  return [(long >>> 24) & 0xff, (long >>> 16) & 0xff, (long >>> 8) & 0xff, long & 0xff].join(".");
}

export function calculateSubnet(ip: string, cidr: number) {
  const maskLong = (0xffffffff << (32 - cidr)) >>> 0;
  const ipLong = ipToLong(ip);

  const networkLong = (ipLong & maskLong) >>> 0;
  const broadcastLong = (networkLong | ~maskLong) >>> 0;

  const firstHostLong = (networkLong + 1) >>> 0;
  const lastHostLong = (broadcastLong - 1) >>> 0;
  const numHosts = Math.max(0, broadcastLong - networkLong - 1);

  return {
    ip,
    cidr,
    mask: longToIp(maskLong),
    wildcard: longToIp(~maskLong),
    network: longToIp(networkLong),
    broadcast: longToIp(broadcastLong),
    firstHost: longToIp(firstHostLong),
    lastHost: longToIp(lastHostLong),
    numHosts,
    binary: {
      ip: ipLong.toString(2).padStart(32, "0").match(/.{8}/g)?.join(".") || "",
      mask: maskLong.toString(2).padStart(32, "0").match(/.{8}/g)?.join(".") || "",
    },
  };
}
