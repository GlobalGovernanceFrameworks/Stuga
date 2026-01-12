// User type
export interface User {
  id: string;
  user_id: string;
  name: string;                    // Real name (private)
  display_name?: string;           
  phone_number?: string;
  bankid_verified: boolean;
  created_at: number;
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
  registration_completed?: boolean;
  privacy_settings?: {
    exact_distance: boolean;
    show_hearts: boolean;
  };
  blocked_users?: string[];
  reputation?: Reputation;      // Calculated reputation data
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

// Contact request type
export interface ContactRequest {
  id: string;
  from_user: string;
  to_user: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: number;
  responded_at?: number;
  message?: string; // Optional message with request
}

// Reputation type
export interface Reputation {
  score: number;                // 0-100 overall reputation score
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  
  metrics: {
    hearts_given: number;       // Total Hearts sent to others
    hearts_received: number;    // Total Hearts received from others
    resources_shared: number;   // Total resources posted (offers + needs)
    response_time_avg: number;  // Average hours to respond to contact requests
    completion_rate: number;    // % of resources marked as completed (0-1)
    active_days: number;        // Number of days with activity
  };
  
  badges: string[];             // Earned badges: "generous_giver", "quick_responder", etc.
  calculated_at: number;        // Timestamp of last calculation
  calculated_by: 'server' | 'client';
}

