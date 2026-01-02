import { Modal, View, Text, ScrollView, Button } from "react-native";

type JsonModalProps = {
  visible: boolean;
  onClose: () => void;
  data: unknown;
};

export default function JsonModal({ visible, onClose, data }: JsonModalProps) {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ padding: 16, flex: 1 }}>
        <Button title="Close" onPress={onClose} />
        <ScrollView>
          <Text selectable>
            {JSON.stringify(data, null, 2)}
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}
