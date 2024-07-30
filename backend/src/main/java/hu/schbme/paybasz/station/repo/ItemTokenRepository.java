package hu.schbme.paybasz.station.repo;

import hu.schbme.paybasz.station.dto.ItemTokenView;
import hu.schbme.paybasz.station.model.ItemTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface ItemTokenRepository extends JpaRepository<ItemTokenEntity, Integer> {

	@Query("select t from ItemTokenEntity t where t.userId = ?1 and t.itemId = ?2")
	Optional<ItemTokenEntity> findItemToken(Integer userId, Integer itemId);

	@Modifying
	@Transactional
	@Query("update ItemTokenEntity t set t.count = (t.count + ?3) where t.userId = ?1 and t.itemId = ?2")
	void addToItemTokenCount(Integer userId, Integer itemId, Integer amount);

	@Modifying
	@Transactional
	@Query("delete from ItemTokenEntity t where t.userId = ?1 and t.itemId = ?2")
	int deleteItemToken(Integer userId, Integer itemId);

	@Query("select new hu.schbme.paybasz.station.dto.ItemTokenView(t.id, i.id, i.name, a.id, a.name, t.count) " +
			"from ItemTokenEntity t " +
			"inner join ItemEntity i on t.itemId = i.id " +
			"inner join AccountEntity a on t.userId = a.id ")
	List<ItemTokenView> getAllItemTokenViews();
}
