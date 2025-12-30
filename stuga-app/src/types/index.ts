// User type
export interface User {
  id: string;
  user_id: string;              // BankID personnummer (hashed)
  name: string;
  bankid_verified: boolean;
  created_at: number;            // timestamp
  location: {
    lat: number;
    lon: number;
    accuracy: number;
    updated_at: number;
  };
  hearts_balance: number;
  availability_status: 'available' | 'away' | 'emergency';
  bluetooth_id?: string;
  fcm_token?: string;
}

// Resource type
export interface Resource {
  id: string;
  user_id: string;
  type: 'offer' | 'need';
  category: 'mat' | 'värme' | 'verktyg' | 'transport' | 'kunskap' | 'boende' | 'första_hjälpen' | 'annat';
  title: string;
  description: string;
  status: 'open' | 'matched' | 'completed' | 'cancelled';
  matched_with_user: string | null;
  hearts_value: number | null;
  created_at: number;
  updated_at: number;
  expires_at?: number;
}

// Hearts transaction type
export interface HeartsTransaction {
  id: string;
  from_user: string;
  to_user: string;
  amount: number;
  reason: string;
  related_resource: string | null;
  confirmed_by_sender: boolean;
  confirmed_by_receiver: boolean;
  created_at: number;
  completed_at: number | null;
}

// Mesh node type (for Bluetooth discovery)
export interface MeshNode {
  id: string;
  bluetooth_id: string;
  user_id: string;
  signal_strength: number;       // RSSI
  distance_estimate: number;     // meters
  last_seen: number;
  device_info: {
    platform: 'ios' | 'android';
    app_version: string;
  };
}
