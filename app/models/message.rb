class Message < ActiveRecord::Base
  belongs_to :missed_connection
  belongs_to :sender,
    :class_name => 'User',
    :primary_key => :id,
    :foreign_key => :sender_id
  belongs_to :receiver,
    :class_name => 'User',
    :primary_key => :id,
    :foreign_key => :receiver_id
end
